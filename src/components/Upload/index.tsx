import { attachmentAdd, attachmentList, stsInit } from '@/services/common';
import { Button, message, Modal, Upload } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import SparkMD5 from 'spark-md5';
import COS from 'cos-js-sdk-v5';

export interface IUploadImage {
  accept?: string;
  maxFileSize?: number;
  minFileSize?: number;
  onChange?: (file: any, name?: string) => void; // 上传后事件回调
  children?: ReactNode;
  btnName?: string;
  url?: string;
}

const UploadImage: FC<IUploadImage> = (props) => {
  const {
    onChange,
    maxFileSize = 200,
    minFileSize = 0,
    accept = '.jpg,.jpeg,.png,.gif,.pdf,.dmg',
    children,
    btnName,
    url,
  } = props;
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [percent, setPercent] = useState(0);
  const [http, setHttp] = useState(url);

  useEffect(() => {
    setHttp(url);
  }, [url]);

  /**
   * 查看预览
   * @param file
   */
  const handlePreview = (e: React.MouseEvent, file: string) => {
    if (e) e.stopPropagation();
    if (!file) return;
    setPreviewVisible(true);
    setPreviewImage(file);
  };

  /**
   * 关闭预览
   */
  const handleCancel = () => {
    setPreviewVisible(false);
  };

  /**
   *  处理图片
   */
  const handleChange = (file?: string) => {
    if (file) {
      setHttp(file);
      if (onChange) onChange(file);
    }
  };

  /**
   *  移除图片
   */
  const handleRemove = (e: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onChange) onChange('');
    setHttp('');
  };

  /**
   * 获取扩展名
   * @param fileUrl 文件路径
   * @returns 扩展名
   */
  const getFileExt = (fileUrl: string) => {
    let r = '';
    if (typeof fileUrl === 'string') {
      const index = (fileUrl && fileUrl?.lastIndexOf('.')) || 0;
      const ext = fileUrl?.substr(index + 1);
      r = ext.toLowerCase();
    }
    return r;
  };

  const getMd5 = (file: RcFile) => {
    // 获取apk的md5
    return new Promise((resolve) => {
      const fileReader = new FileReader();
      const spark = new SparkMD5(); // 创建md5对象（基于SparkMD5）
      fileReader.readAsBinaryString(file); // myfile 对应上传的文件

      // 文件读取完毕之后的处理
      fileReader.onload = (e: ProgressEvent<FileReader>) => {
        spark.appendBinary(e.target?.result as string);
        const md5 = spark.end();
        resolve(md5);
      };
    });
  };

  /**
   *  上传前验证
   */
  const beforeUpload = async (file: RcFile): Promise<any> => {
    console.log(file);
    const size = file.size / 1024 / 1024;
    const isLtMax = size < maxFileSize!;
    const isGtMin = size > minFileSize!;
    const isValid = accept === '*' ? true : accept!.indexOf(getFileExt(file.name)) !== -1;

    if (!isValid) {
      message.warning('请您选择正确的文件格式');
    }

    if (!isGtMin) {
      message.error(`文件不能小于${minFileSize}M限制`);
    }

    if (!isLtMax) {
      message.error(`文件不能大于${maxFileSize}M限制`);
    }

    // stsInit
    return new Promise(async () => {
      if (isLtMax && isGtMin && isValid) {
        // 异步获取临时密钥
        const res = await stsInit({ prefix: 'subject/*' });
        const { bucket, region, credentials, startTime, expiredTime } = res.data;
        // 初始化实例
        const cos = new COS({
          getAuthorization: async (options: any, callback: any) => {
            console.log(options, 2222);
            if (!res.data || !credentials) return console.error('credentials invalid');
            callback({
              TmpSecretId: credentials.tmpSecretId,
              TmpSecretKey: credentials.tmpSecretKey,
              SecurityToken: credentials.sessionToken,
              // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
              StartTime: startTime, // 时间戳，单位秒，如：1580000000
              ExpiredTime: expiredTime, // 时间戳，单位秒，如：1580000900
            });
          },
        });
        const md5 = await getMd5(file);
        const name = `${md5}.${getFileExt(file.name)}`;
        // 分片上传文件
        cos.putObject(
          {
            Bucket: bucket /* 必须 */,
            Region: region /* 存储桶所在地域，必须字段 */,
            Key: `subject/${name}`,
            StorageClass: 'STANDARD',
            Body: file,
            onProgress: function (progressData) {
              setPercent(progressData.percent);
              console.log('上传中', JSON.stringify(progressData));
            },
          },
          async (err, data) => {
            console.log(err, data);
            if (err) {
              setPercent(0);
              message.error('服务器错误，请重新上传');
            }

            if (data) {
              message.success('上传成功');
              const attachment = md5 as string;
              const param = {
                current: 1,
                pageSize: 10,
                filter: JSON.stringify({
                  attachment,
                  up: 1,
                  aid: 1,
                  sid: 1,
                }),
              };
              const usedList = await attachmentList(param);
              console.log(usedList);
              if (usedList.data?.list?.length) {
                handleChange(usedList.data?.list?.[0].url);
              } else {
                const r = await attachmentAdd({
                  sid: 1,
                  aid: 1,
                  attachment,
                  file_path: `subject/${name}`,
                  file_name: file.name,
                  file_type: file.type,
                  file_size: file.size,
                  is_remote: false,
                });
                handleChange(r.data.url);
              }
            }
          },
        );
      }
    });
  };

  const upload = http ? (
    <>
      <img onClick={(e: React.MouseEvent) => handlePreview(e, http)} src={http} width="100" />
      <span onClick={handleRemove}>x</span>
    </>
  ) : (
    <Upload accept={accept} beforeUpload={beforeUpload}>
      {btnName ? (
        <Button type="primary">
          {btnName} {percent > 0 && percent < 1 ? `${percent * 100}%` : ''}
        </Button>
      ) : (
        children
      )}
    </Upload>
  );

  return (
    <>
      {upload}
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel} title="图片预览">
        <img style={{ maxWidth: '100%' }} src={previewImage} alt="图片预览" />
      </Modal>
    </>
  );
};

export default UploadImage;