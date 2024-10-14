'use client'

import "./globals.css";
import { Provider } from 'react-redux';
import store from '../redux/store';
import Navigation from '../components/Navigation/Navigation';
import styled from 'styled-components';
import Header from '../components/Header/Header';
import { useEffect } from 'react';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    document.body.classList.remove('preload');
  }, []);

  return (
    <Provider store={store}>
      <html lang="no">
        <head>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <Body className="preload">
            <Header />
            <Div>
              <Navigation />
              <Main>
                {children}
              </Main>
            </Div>
        </Body>
      </html>
    </Provider>
  );
}

const Body = styled.body`
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const Div = styled.div`
  display: flex;
`

const Main = styled.main`
  flex: 1;
`