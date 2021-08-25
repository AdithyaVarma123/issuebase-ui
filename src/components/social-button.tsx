import { Button } from "@material-ui/core";
import React from "react";
import SocialLogin from "react-social-login";

class SocialButton extends React.Component {
    render() {
        // @ts-ignore
        const { children, triggerLogin, ...props } = this.props;
        return (
            <Button onClick={triggerLogin} {...props} variant="contained">
                {children}
            </Button>
        );
    }
}

export default SocialLogin(SocialButton);
