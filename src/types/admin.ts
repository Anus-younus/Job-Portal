export type AdminType = {
    name?: string,
    email: string,
    role:string,
    uid: string,
    emailVerified: boolean
    logo?:string,
    deleted?: boolean,
    hold?:boolean
}