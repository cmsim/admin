export type InitialState = Record<string, unknown>

export type InitReq = {
  username: string
  password: string
  email?: string
  isAdmin?: number
}

export type LoginReq = Omit<InitReq, 'email'>
export type LoginRes = {
  refreshToken: string
  token: string
}

export type UserInfoData = {
  avatar: string
  id: string
  admin: number
  username: string
}
