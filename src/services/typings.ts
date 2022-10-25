export interface IDate {
  // 创建时间
  readonly created_at?: string
  // 修改时间
  readonly updated_at?: string
  // 删除时间
  readonly deleted_at?: string
}

export interface IResponse {
  status?: number
  message?: string
}

export type IPages = {
  current?: number
  pageSize?: number
  total?: number
}

export interface IHits {
  hits?: number
  hits_day?: number
  hits_week?: number
  hits_month?: number
  hits_lasttime?: string
}

export interface IId {
  id?: number | string
  cid?: number
  uid?: number
  sid?: number
  aid?: number
  status?: string
}

export interface IUser extends IDate {
  id: number
  username: string
  password?: string
  pay_password: string
  avatar: string
  email: string
  mobile: string
  signature: string
  realname: string
  identity: string
  birthday: string
  nickname: string
  salt: string
  amount: number
  sex: number
  admin?: number
  score: number
  login: number
  email_confirmed: number
  mobile_confirmed: number
  is_remind: number
  is_station: number
  register_ip: number
  last_login_ip: number
  update_ip: number
  status: number
  forget_at: string
  login_at: string
  avatar_at: string
  joined_at: string
}

export interface IFeed extends IHits, IDate, Omit<IId, 'cid'> {
  type: number
  ip: number
  expired_at: string
  comment_count: number
  like_count: number
  forward_count: number
  collection_count: number
}

export interface IMcat {
  id?: number | string
  cid: number | string
  name: string
  title: string
  rank: number
}

export interface IMcid {
  id: number
  aid: number
  mid: number
  sid: number
}

export interface IPlay {
  id?: number | string
  title?: string
  name?: string
  rank?: number
  status?: number
  display?: number
}

export interface IList extends Omit<IId, 'uid' | 'aid' | 'cid'> {
  rank?: number
  pid?: string | number
  name?: string
  dir?: string
  icon?: string
  seo_title?: string
  seo_keywords?: string
  seo_description?: string
}

export interface ISubject extends IHits, IDate, Omit<IId, 'sid' | 'aid'> {
  mcid: (string | number)[]
  mcat: IMcat[]
  name: string
  foreign: string
  aliases: string
  title: string
  tag: string
  label: string
  color: string
  bg_color: string
  star: string
  director: string
  pic: string
  pic_thumb: string
  bigpic: string
  website: string
  original: string
  company: string
  remark: string
  baike: string
  time: string
  area: string
  language: string
  play: string
  inputer: string
  jumpurl: string
  letter: string
  letters: string
  seo_title: string
  seo_keywords: string
  seo_description: string
  filmtime: string
  length: string
  roles: string
  content: string
  other: string
  prty: number
  year: string
  serialized: number
  total: number
  isend: number
  stars: number
  up: number
  down: number
  rank: number
  gold: number
  weekday: string[]
  douban: number
  imdb: number
  broadcast: number
  ip: number
  comment_count: number
  like_count: number
  forward_count: number
  collection_count: number
  association?: IAssociation
  associate1: ISubject[]
  associate2: ISubject[]
}

export interface IAttachment extends IDate, Omit<IId, 'cid'> {
  attachment?: string
  file_path?: string
  file_name?: string
  file_type?: string
  file_size?: number
  is_remote?: boolean
  url?: string
  ip?: number
}

export interface IAssociation extends IDate, IId {
  tsid: number
  taid: number
}

export interface ISetting {
  id?: number | string
  key: string
  value: string
  tag: string
}

export interface IFavorite extends IDate, Omit<IId, 'status'> {
  tags: string
  content: string
  ip: number
  rating: number
  interest: number
}

export interface IFollow extends IDate {
  id: number
  uid: number
  tuid: number
  ip: number
}

export interface ITag extends IDate {
  id: number
  name: string
  aid: number
  sid: number
}

export interface INews extends IDate, IHits, Omit<IId, 'aid' | 'sid'> {
  mcid: string
  name: string
  title: string
  tag: string
  color: string
  bg_color: string
  time: string
  pic: string
  pic_thumb: string
  bigpic: string
  banner: string
  inputer: string
  jumpurl: string
  letter: string
  letters: string
  seo_title: string
  seo_keywords: string
  seo_description: string
  summary: string
  content: string
  stars: number
  up: number
  down: number
  gold: number
  is_spoiler: number
  is_sticky: number
}

export interface IComments extends IDate, Omit<IId, 'cid'> {
  content: string
  device: string
  up: number
  down: number
  reply_count: number
  is_sticky: number
}

export interface IReply extends IDate, Omit<IId, 'cid' | 'sid'> {
  reply_uid: number
  content: string
  up: number
  down: number
  device: string
  is_sticky: number
}

export interface IForward extends IDate, IHits, IId {
  content: string
  ip: number
}

export interface IPin extends IDate, IHits, IId {
  tid: number
  content: string
  ip: number
  comment_count: number
  like_count: number
  forward_count: number
}

export interface ITopic extends IDate, IHits, Omit<IId, 'aid'> {
  name: string
  dir: string
  pin_count: number
  follow_count: number
  icon: string
  summary: string
}

export interface IEpisode extends IDate, IHits, IId {
  name: string
  title: string
  url: string
  content: string
  stars: number
  up: number
  down: number
}

export interface IStory extends IDate, IHits, IId {
  name: string
  url: string
  content: string
  serialized: number
  isend: number
  stars: number
}

export interface IActors {
  id: number
  name: string
  aid: number
  type: number
}

export interface IRole extends IDate, IHits, IId {
  name: string
  content: string
  url: string
  color: string
  bg_color: string
  pic: string
  pic_thumb: string
  bigpic: string
  stars: number
  up: number
  down: number
}

export interface IStar extends IDate, IHits, Omit<IId, 'sid' | 'aid'> {
  name: string
  mcid: string
  career: string
  relations: string
  constellation: string
  blood_type: string
  birth_place: string
  area: string
  sex: string
  height: string
  weight: string
  color: string
  bg_color: string
  nation: string
  citizenship: string
  tag: string
  alias: string
  foreign: string
  birth_time: string
  school: string
  company: string
  imdb: string
  website: string
  url: string
  letter: string
  letters: string
  pic: string
  pic_thumb: string
  bigpic: string
  content: string
  info: string
  stars: number
  flower: number
  up: number
  down: number
}

export interface ILinkCategory extends Omit<IId, 'sid' | 'aid' | 'cid'> {
  pid: number
  rank: number
  name: string
  dir: string
  icon: string
  password: string
  content: string
  salt: string
}

export interface ILink extends IDate, IHits, Omit<IId, 'aid'> {
  name: string
  url: string
  icon: string
  color: string
  text: string
  content: string
  is_home: boolean
  ip: number
}

export interface ILog extends Omit<IDate, 'updated_at'> {
  id: number
  type: string
  referer: string
  author: string
  ip: number
}

export interface IDetailedlist extends IDate, IHits, IId {
  tsid: number
  taid: number
  rank: number
  remark: string
}

export interface IListcategory extends IDate, IId {
  icon: string
  rank: number
  remark: string
}

export interface IDigg extends Omit<IDate, 'updated_at'>, Omit<IId, 'status'> {
  up: number
  down: number
  ip: number
}

export interface ISts {
  credentials: {
    sessionToken: string
    tmpSecretId: string
    tmpSecretKey: string
  }
  startTime: number
  expiredTime: number
  region: string
  bucket: string
}

export interface IListResponse<T> extends IResponse {
  data?: {
    list?: T[]
    current?: number | string
    pageSize?: number | string
    total?: number
  }
}

export interface IFeedTable extends IFeed {
  subject: ISubject
  user: IUser
}

export interface ICommentTable extends IComments {
  subject: ISubject
  user: IUser
}

export interface IPinTable extends IPin {
  subject: ISubject
  user: IUser
  topic: ITopic
}

export interface IAttachmentTable extends IAttachment {
  subject: ISubject
  user: IUser
  topic: ITopic
}

export interface ITopicTable extends ITopic {
  user: IUser
}

export interface ILinkTable extends ILink {
  user: IUser
}
