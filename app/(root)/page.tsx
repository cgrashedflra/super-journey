import { auth, signOut } from "@/auth";

const Home = async () => {
  const session = await auth();

  console.log(session);

  return (
    <>
      <h1 className="h1-bold pt-24">Welcome to the world of Next.js</h1>
    </>
  );
};

export default Home;
