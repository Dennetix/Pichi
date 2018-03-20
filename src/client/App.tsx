import * as React from 'react';
import { render } from 'react-dom';

import Test from './components/Test';

const App = () => {
    return (
        <Test/>
    );
};

render(<App />, document.getElementById('app'));

export default App;
