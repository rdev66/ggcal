import * as React from 'react';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler} from 'reactstrap';
import {Link} from 'react-router-dom';


interface User {
    id: string;
    name: string;
    email: string;
}

interface Props {
    user: User;
    csrfToken: string;
}


interface State {
    // state types
    isOpen: boolean;
    csrfToken: string;
}

export default class AppNavbar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const {csrfToken} = props;
        this.state = ({isOpen: false, csrfToken: csrfToken});
        this.toggle = this.toggle.bind(this);
        console.log('HH');
        console.log(this.props.user);
    }

    toggle() {
        this.setState({isOpen: !this.state.isOpen});
    }

    render() {
        return <Navbar color="dark" dark expand="md">
            <NavbarBrand tag={Link} to="/">Home</NavbarBrand>
            <NavbarToggler onClick={this.toggle}/>
            <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar>
                    {this.props.user.name != "" ? <NavbarBrand tag={Link} to="/">{this.props.user.name}</NavbarBrand>
                        // : <NavbarBrand tag={Link} to={this.logout}>Logout</NavbarBrand>
                        : ''
                    }
                </Nav>
            </Collapse>
        </Navbar>;
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
}