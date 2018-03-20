import * as React from 'react';
import Test from 'client/components/Test';
import { shallow } from 'enzyme';

describe('App', () => {
    test('Renders', () => {
        expect(shallow(<Test />)).toHaveLength(1);
    });
});
