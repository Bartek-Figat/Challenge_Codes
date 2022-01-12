export type Index = {
    Users: string
    Db: string
}

export type HeaderToken = {
    token: string
}

export type Status = {
    SUCCESS: number
    CREATED: number
    NO_CONTENT: number
    BAD_REQUEST: number
    UNAUTHORIZED: number
    FORBIDDEN: number
    NOT_FOUND: number
    INTERNAL_SERVER_ERROR: number
}

export type dbOptionsType = {
    useUnifiedTopology: boolean
    useNewdbURIParser: boolean
    useNewUrlParser: boolean
}
