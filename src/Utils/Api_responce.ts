class ApiResponce<T> {
  status: number;
  success: boolean;
  message: string;
  data: T | null;

  constructor(status: number, data: T | null, message: string) {
    ((this.status = status), (this.success = status < 400));
    this.message = message;
    this.data = data;
  }
}

export default ApiResponce;
