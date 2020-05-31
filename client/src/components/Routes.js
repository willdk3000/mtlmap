import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Map from './Map';

const Routes = () => (
  <Switch>
    <Route exact path="/map" component={Map} />
    <Route path="*" component={Map} />
  </Switch>
);

export default Routes;