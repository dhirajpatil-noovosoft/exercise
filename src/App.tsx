import React, { Component } from 'react';
import { RouterContext, RouterView } from 'mobx-state-router';
import { initRouter } from './initRouter';
import { viewMap } from './viewMap';
interface AppState {}
class App extends Component<{}, AppState> {
    private routerStore = initRouter(); // Initialize the router store

    render() {
        return (
            <RouterContext.Provider value={this.routerStore}>
                <RouterView viewMap={viewMap} /> {/* Pass the viewMap here */}
            </RouterContext.Provider>
        );
    }
}

export default App;
