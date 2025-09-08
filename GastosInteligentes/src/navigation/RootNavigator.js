import React, {useEffect, useState} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";

import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";
import { auth } from "../config/firebase";

const RootNavigator = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) =>{
            setUser(currentUser)
            setLoading(false);
        })

        return unsubscribe;
    }, [])

    if(loading){
        return null;
    }

    return(
        <NavigationContainer>
            {user ? <AppNavigator/> : <AuthNavigator/>}
        </NavigationContainer>
    )
}

export default RootNavigator;