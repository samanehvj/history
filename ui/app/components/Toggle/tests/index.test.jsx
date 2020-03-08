/* global describe, expect, test */
import React from 'react';
import { render } from 'react-testing-library';
import { IntlProvider, defineMessages } from 'react-intl';

import Toggle from '..';

describe('<Toggle />', () => {
  test('should contain default text', () => {
    const defaultEnMessage = 'someContent';
    const defaultDeMessage = 'someOtherContent';
    const messages = defineMessages({
      en: {
        id: 'history.containers.LocaleToggle.en',
        defaultMessage: defaultEnMessage,
      },
      de: {
        id: 'history.containers.LocaleToggle.en',
        defaultMessage: defaultDeMessage,
      },
    });
    const { container } = render(
      <IntlProvider locale="en">
        <Toggle values={['en', 'de']} messages={messages} />
      </IntlProvider>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should not have ToggleOptions if props.values is not defined', () => {
    const { container } = render(<Toggle />);
    const elements = container.querySelectorAll('option');
    expect(elements).toHaveLength(1);
    expect(container.firstChild.value).toEqual('--');
  });
});
