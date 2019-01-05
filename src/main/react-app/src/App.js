import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    state = {
        isLoading: true,
        calendars: []
    };

    async componentDidMount() {
        const response = await fetch('/calendar');
        const body = await response.json();
        this.setState({calendars: body, isLoading: false});
    }

    render() {
        const {calendars, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <div className="App-intro">
                        <h2>Calendar List</h2>
                        {calendars.map(calendar =>
                            <div key={calendar.id}>
                                {calendar.name} - {calendar.countryCode}
                            </div>
                        )}
                    </div>
                </header>
            </div>
        );
    }
}

export default App;