export type JobSeekerType = {
    name?:string,
    logo?:string,
    description?:string,
    phone?:string,
    address?:string,
    email:string,
    uid:string,
    role:string,
    resume?:string,
    emailVerified: boolean
    deleted?: boolean,
    hold?:boolean
}