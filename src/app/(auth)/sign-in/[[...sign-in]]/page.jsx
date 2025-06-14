import { SignIn } from "@clerk/nextjs"

const Page = () => {
  return <SignIn afterSignInUrl="/onboarding" afterSignUpUrl="/onboarding" />
}

export default Page