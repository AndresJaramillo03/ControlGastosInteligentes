import React, {useEffect, useState} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";

import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
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
            {user ? <AppStack/> : <AuthStack/>}
        </NavigationContainer>
    )
}

export default RootNavigator;