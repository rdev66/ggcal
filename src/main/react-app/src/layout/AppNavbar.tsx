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
}


interface State {
    // state types
    isOpen: boolean;
}

export default class AppNavbar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = ({isOpen: false});
        this.toggle = this.toggle.bind(this);
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
                    <NavbarBrand tag={Link} to="/">{this.props.user.name}</NavbarBrand>
                </Nav>
            </Collapse>
        </Navbar>;
    }
}