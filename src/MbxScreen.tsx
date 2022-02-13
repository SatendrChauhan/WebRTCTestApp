import { types, onSnapshot } from "mobx-state-tree"
import { Text, View } from "react-native"

// A tweet has a body (which is text) and whether it's read or not
const Tweet = types
    .model("Tweet", {
        body: types.string,
        read: false // automatically inferred as type "boolean" with default "false"
    })
    .actions((tweet) => ({
        toggle() {
            tweet.read = !tweet.read
        }
    }))

// Define the Twitter "store" as having an array of tweets
const TwitterStore = types.model("TwitterStore", {
    tweets: types.array(Tweet)
})

// create your new Twitter store instance with some initial data
const twitterStore = TwitterStore.create({
    tweets: [
        {
            body: "Anyone tried MST?"
        }
    ]
})

// Listen to new snapshots, which are created anytime something changes
onSnapshot(twitterStore, (snapshot) => {
    console.log(snapshot)
})

// Let's mark the first tweet as "read" by invoking the "toggle" action
twitterStore.tweets[0].toggle()


export const MbxScreen = () => {
    return (
        <View>
            <Text>This is mobx screen </Text>
        </View>
    )

}
