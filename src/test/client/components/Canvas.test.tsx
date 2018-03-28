import * as React from 'react';
import { shallow } from 'enzyme';

import Canvas from 'client/components/Canvas';

describe('App Component', () => {
    test('Renders', () => {
        expect(shallow(<Canvas />)).toHaveLength(1);
    });
});
