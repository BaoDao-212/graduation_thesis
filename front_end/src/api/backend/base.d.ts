declare namespace API {
  type BaseDto = {
    ok: boolean;
    error: {
      mainRession: string;
      message: string;
    };
  };
}
