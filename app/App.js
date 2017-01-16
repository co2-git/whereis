import React, {Component} from 'react';
import {Row} from 'reactors-grid';
import {Button, TextInput} from 'reactors-form';
import {Text, View} from 'reactors';
import map from 'lodash/map';
import uniqBy from 'lodash/uniqBy';
import Icon from 'reactors-icons';
import {stat} from 'fs';
import pathUtil from 'path';

function fileExists(file) {
  return new Promise((resolve) => {
    stat(file, (error) => {
      resolve(!(error instanceof Error));
    });
  });
}

export default class WhereIs extends Component {
  state = {
    cmd: 'bash',
    locations: [],
  };

  componentDidMount() {
    this.getLocations();
  }

  getLocations() {
    const rawLocations = map(
      process.env.PATH.split(':'),
      (path) => ({path, searching: false}),
    );

    const locations = uniqBy(rawLocations, 'path');

    this.setState({locations});
  }

  find = () => {
    const locations = map(this.state.locations, (location) => ({
      ...location,
      searching: true,
    }));
    this.setState({
      locations,
    }, () => {
      const check = ({path}) => new Promise(async (resolve, reject) => {
        try {
          const found = await fileExists(
            pathUtil.join(path, this.state.cmd),
          );
          console.warn({found});
          this.setState(
            {locations: map(locations, (location) => {
              if (location.path === path) {
                location.found = found;
              }
              return location;
            })},
            () => {
              resolve(found);
            }
          );
        } catch (error) {
          reject(error);
        }
      });

      Promise.all(map(locations, check));
    });
  }

  find2 = () => {
    const {cmd} = this.state;

    const rawLocations = map(
      process.env.PATH.split(':'),
      (path) => ({path}),
    );

    const locations = uniqBy(rawLocations, 'path');

    this.setState(
      {locations},
      () => {
        const checkers = map(locations,
          ({path}) => new Promise(async (resolve, reject) => {
            try {
              const found = await fileExists(path);
              this.setState(
                {locations: map(locations, (location) => {
                  if (location.path === path) {
                    location.found = found;
                  }
                  return location;
                })},
                () => {
                  resolve(found);
                }
              );
            } catch (error) {
              reject(error);
            }
          }),
        );

        Promise.all(
          map(locations, ({path}) => fileExists(path)),
        );
      },
    );
  };

  render() {
    console.log(this.state.locations);
    const {cmd} = this.state;
    return (
      <View>
        <Row>
          <Text>Where is</Text>
          <TextInput
            value={cmd}
            onChange={(cmd) => this.setState({cmd})}
            />
          <Button
            onPress={this.find}
            >
            ?
          </Button>
        </Row>

        {
          this.state.locations.length > 0 &&
          <Text style={{fontWeight: 'bold'}}>
            Looking up your included paths for {cmd}
          </Text>
        }

        {
          map(this.state.locations, (location) => {
            let color = 'gray';

            if (location.found === true) {
              color = 'green';
            } else if (location.found === false) {
              color = 'orange';
            }

            return (
              <Row left key={location.path}>
                {
                  !('found' in location) && location.searching &&
                  <Icon name="circle-o-notch" rotate />
                }
                {
                  location.found === true &&
                  <Icon name="thumbs-o-up" color={color} />
                }
                {
                  location.found === false &&
                  <Icon name="times" color={color} />
                }
                <Text style={{color}}>{location.path}</Text>
              </Row>
            );
          })
        }
      </View>
    );
  }
}
