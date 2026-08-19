import jwt from "jsonwebtoken";


export default function User(token: string) {

    const data = jwt.verify(token as string, process.env.SECRET_ACCESS_TOKEN!);
    console.log(data);
}
