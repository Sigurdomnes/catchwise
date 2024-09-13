type Style = React.CSSProperties

export default function Nav(style: Style) {
    return (
        <nav style={{
            height: '100vh',
            width: '15rem',
            background: '#CCDADC',
            padding: '1rem',
            textAlign: 'center'
        }}>
            <h1 style={{
                color: '#001D21',
                fontFamily: 'sans-serif'
            }}>
                GSE-report
            </h1>
        </nav>
    );
}