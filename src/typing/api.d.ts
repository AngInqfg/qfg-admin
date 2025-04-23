type loginRequestType = string
interface userRequestType {
    username: string,
    phone: number,
    avatar: string,
    token: string
}
interface msgRequestType {
    createTime?: number,
    _id?: string,
    content: string,
    imageList: any,
}
interface menuRequestType {
    path: string,
    title: string,
    icon: string,
    show: boolean
}