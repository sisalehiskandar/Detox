describe(':android: Launch arguments', () => {
  async function assertLaunchArg(launchArgs, key) {
    const expectedValue = JSON.stringify(launchArgs[key]);
    await expect(element(by.id(`launchArg-${key}.name`))).toBeVisible();
    await expect(element(by.id(`launchArg-${key}.value`))).toHaveText(expectedValue);
  }

  it('should handle simple args', async () => {
    const launchArgs = {
      hello: 'world',
    };

    await device.launchApp({newInstance: true, launchArgs});

    await element(by.text('Launch Args')).tap();
    await assertLaunchArg(launchArgs, 'hello');
  });

  it('should handle multiple, complex args', async () => {
    const launchArgs = {
      complex: {
        bull: ['s', 'h', 1, 't'],
        and: {
          then: 'so, me',
        }
      },
      multiple: 'arguments',
      url: 'https://localhost:8080',
    };

    await device.launchApp({newInstance: true, launchArgs});

    await element(by.text('Launch Args')).tap();

    await assertLaunchArg(launchArgs, 'complex');
    await assertLaunchArg(launchArgs, 'multiple');
    await assertLaunchArg(launchArgs, 'url');
  });
});
