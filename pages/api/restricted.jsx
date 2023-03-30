import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { getToken } from "next-auth/jwt"

export default async (req, res) => {
  //const token = await getToken({ req })
  //console.log(token);

  //const authToken = (req.headers.authorization || '').split("Bearer ")[1];
  //console.log(authToken);
  
  const session = await getServerSession(req, res, authOptions);
  //console.log(session);

  if (session) {
    res.send({
      content:
        "This is protected content. You can access this content because you are signed in.",
    });
  } else {
    res.send({
      error: "You must be signed in to view the protected content on this page.",
    });
  }
}