export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<void>
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = {}
}
