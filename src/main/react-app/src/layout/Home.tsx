import * as React from 'react';
import '../app/App.css';
import AppNavbar from './AppNavbar';
import {Link, match} from 'react-router-dom';
import {Button, Container} from 'reactstrap';
import {History} from "history";
import {Cookies, withCookies} from "react-cookie";

interface Identifiable {
    id: string;
}

interface Props {
    // your props validation
    match: match<Identifiable>;
    history: History;
    cookies: Cookies;
}

interface User {
    id: string;
    name: string;
    email: string;
}

interface State {
    // state types
    isLoading: boolean;
    isAuthenticated: boolean;
    user: User;
    csrfToken: string;
}


class Home extends React.Component<Props, State> {

    state: State = {
        isLoading: false,
        isAuthenticated: false,
        csrfToken: '',
        user: {id: '', name: '', email: ''}
    };

    constructor(props: Props) {
        super(props);
        //Get access to cookies by using withCookies
        const {cookies} = props;
        this.state.csrfToken = cookies.get('XSRF-TOKEN');
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    async componentDidMount() {
        const response = await fetch('/api/user', {credentials: 'include'});
        const body = await response.text();
        if (body === '') {
            this.setState(({isAuthenticated: false}))
        } else {
            this.setState({isAuthenticated: true, user: JSON.parse(body)})
        }
    }

    login() {
        let port = (window.location.port ? ':' + window.location.port : '');
        if (port === ':3000') {
            port = ':8080';
        }
        window.location.href = '//' + window.location.hostname + port + '/private';
    }

    logout() {
        const headers = new Headers();
        headers.append('X-XSRF-TOKEN', this.state.csrfToken);

        //credentials = true transfers cookies.
        fetch('/api/logout', {
            method: 'POST', credentials: 'include',
            headers
        }).then(res => res.json())
            .then(response => {
                window.location.href = response.logoutUrl + "?id_token_hint=" +
                    response.idToken + "&post_logout_redirect_uri=" + window.location.origin;
            });
    }

    render() {
        const message = this.state.user.name ?
            <h2>Welcome, {this.state.user.name}!</h2> :
            <p>Please log in to manage Calendars.</p>;

        const button = this.state.isAuthenticated ?
            <div>
                <Button color="link"><Link to="/calendars">Manage Calendars</Link></Button>
                <br/>
                <Button color="link" onClick={this.logout}>Logout</Button>
            </div> :
            <Button color="primary" onClick={this.login}>Login</Button>;

        return (
            <div>
                <AppNavbar user={this.state.user}/>
                <Container fluid>
                    {message}
                    {button}
                </Container>
            </div>
        );
    }
}

export default withCookies(Home);
