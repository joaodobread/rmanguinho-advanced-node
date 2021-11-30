import { AccessToken } from '@/domain/models'
import { AuthenticationError } from '@/domain/models/errors'

export interface FacebookAuthentication {
  perform: (params: FacebokAuthentication.Params) => Promise<FacebokAuthentication.Result>
}

export namespace FacebokAuthentication {
  export type Params = {
    token: string
  }

  export type Result = AccessToken | AuthenticationError
}
