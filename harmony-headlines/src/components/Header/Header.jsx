import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import "./Header.css"
export default function Header() {
  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  )
}