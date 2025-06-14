import { SignUp } from '@clerk/nextjs'

const Page = () => {
  return <SignUp afterSignUpUrl='/onboarding' afterSignInUrl='/onboarding' />
}

export default Page