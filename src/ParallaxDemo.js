import React, {Component} from "react";
import {Animated, Dimensions, Text, TouchableOpacity, View} from "react-native";
import {Body, Header, List, ListItem, ScrollableTab, Tab, TabHeading, Tabs, Title} from "native-base";
import LinearGradient from "react-native-linear-gradient";

const {width: SCREEN_WIDTH} = Dimensions.get("window");
const IMAGE_HEIGHT = 250;
const HEADER_HEIGHT = 64;
const SCROLL_HEIGHT = IMAGE_HEIGHT - HEADER_HEIGHT;
const COLOR = "rgba(85,186,255, 1)";
const FADED_COLOR = "rgba(85,186,255, 0.8)";

export class ParallaxDemo extends Component {
    nativeScroll = new Animated.Value(0);
    scroll = new Animated.Value(0);
    tabTextColor = this.scroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT * 0.2, SCROLL_HEIGHT],
        outputRange: [COLOR, FADED_COLOR, "white"],
        extrapolate: "clamp"
    });
    tabColor = this.scroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT],
        outputRange: ["white", COLOR],
        extrapolate: "clamp"
    });
    tabScroll = this.nativeScroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT, SCROLL_HEIGHT + 1],
        outputRange: [0, 0, 1]
    });
    headerColor = this.scroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT, SCROLL_HEIGHT + 1],
        outputRange: ["transparent", "transparent", COLOR],
        extrapolate: "clamp"
    });
    imageScale = this.nativeScroll.interpolate({
        inputRange: [-25, 0],
        outputRange: [1.1, 1],
        extrapolateRight: "clamp"
    });
    imageOpacity = this.nativeScroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT],
        outputRange: [1, 0],
        extrapolate: "clamp"
    });
    tabProps = {
        tabStyle: {backgroundColor: "transparent", width: SCREEN_WIDTH / 2},
        activeTabStyle: {backgroundColor: "transparent", width: SCREEN_WIDTH / 2}
    };
    tabContent = (<List>
        {new Array(20).fill(null).map((_, i) => {
            return (<ListItem key={i}>
                <Text>Item {i}</Text>
            </ListItem>)
        })}
    </List>);

    constructor(props) {
        super(props);
        this.nativeScroll.addListener(Animated.event([{value: this.scroll}], {useNativeDriver: false}));
    }

    renderTab(name, page, isTabActive, onPressHandler, onLayoutHandler, tabStyle, activeTabStyle) {
        return (
            <TouchableOpacity key={page} onPress={() => onPressHandler(page)} onLayout={onLayoutHandler}
                              activeOpacity={0.4}>
                <Animated.View style={{flex: 1, height: 100, backgroundColor: this.tabColor}}>
                    <TabHeading scrollable style={isTabActive ? activeTabStyle : tabStyle} active={isTabActive}>
                        <Animated.Text style={{fontWeight: isTabActive ? "bold" : "normal", color: this.tabTextColor, fontSize: 14}}>
                            {name}
                        </Animated.Text>
                    </TabHeading>
                </Animated.View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View>
                <Animated.View
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: HEADER_HEIGHT,
                        backgroundColor: this.headerColor,
                        zIndex: 1,
                    }}>
                    <Header style={{backgroundColor: "transparent"}} hasTabs>
                        <Body>
                        <Title>
                            <Animated.Text style={{color: this.tabTextColor, fontWeight: "bold"}}>
                                Tab Parallax
                            </Animated.Text>
                        </Title>
                        </Body>
                    </Header>
                </Animated.View>
                <Animated.ScrollView
                    scrollEventThrottle={5}
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event([{
                        nativeEvent: {
                            contentOffset: {
                                y: this.nativeScroll
                            }
                        }
                    }], {useNativeDriver: true})} style={{zIndex: 0}}>
                    <Animated.View
                        style={{
                            transform: [{translateY: Animated.multiply(this.nativeScroll, 0.65)}, {scale: this.imageScale}],
                            backgroundColor: COLOR
                        }}>
                        <Animated.Image
                            source={{uri: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Moraine_Lake_17092005.jpg"}}
                            style={{
                                height: IMAGE_HEIGHT,
                                width: "100%",
                                opacity: this.imageOpacity
                            }}>
                            <LinearGradient
                                colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.35)", "rgba(255,255,255,0)"]}
                                locations={[0, 0.25, 1]}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0
                                }}/>
                        </Animated.Image>
                    </Animated.View>
                    <Tabs renderTabBar={(props) => {
                        return <Animated.View
                            style={{
                                transform: [{translateY: this.tabScroll}],
                                zIndex: 1,
                                width: "100%",
                                backgroundColor: "white"
                            }}>
                            <ScrollableTab {...props}
                                           renderTab={(...args) => this.renderTab(...args)}
                                           underlineStyle={{backgroundColor: this.tabTextColor}}/>
                        </Animated.View>
                    }}>
                        <Tab heading="Tab 1" {...this.tabProps}>
                            {this.tabContent}
                        </Tab>
                        <Tab heading="Tab 2" {...this.tabProps}>
                            {this.tabContent}
                        </Tab>
                    </Tabs>
                </Animated.ScrollView>
            </View>
        )
    }
}