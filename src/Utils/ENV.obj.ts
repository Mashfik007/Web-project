const accessToken = process.env.SECRET_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error("SECRET_ACCESS_TOKEN is not defined");
}

const environmentENV = {
  accessToken: new TextEncoder().encode(accessToken),
};
