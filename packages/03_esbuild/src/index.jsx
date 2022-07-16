import Serve from 'react-dom/server'

const Greet = () => <h1>hello JueJin</h1>
console.log(Serve.renderToString(<Greet />))
