import React from 'react'
import styled from 'styled-components'
import { CatchWiseLogo } from '@/assets/catchwiselogo'
import { useRouter } from 'next/navigation'

function Header() {

    const router = useRouter();

    const handleLogoClick = () => {
        router.push("/")
    }

    return (
        <HeaderContainer>
            <LogoContainer onClick={handleLogoClick}>
                <CatchWiseLogo />
            </LogoContainer>
            <Shadow/>
        </HeaderContainer>
    )
}

export default Header

const HeaderContainer = styled.header`
    width: 100vw;
    height: 2.5rem;
    display: flex;
    background: #ccc;
`

const LogoContainer = styled.div`
    display: flex;
    height: 100%;
    width: 20rem;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`

const Shadow = styled.div`
    flex: 1;
    height: 2.5rem;
    border-bottom: 1px solid #ccc;
    z-index: 2;
`