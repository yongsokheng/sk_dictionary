import {StyleSheet} from "react-native";

export default Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 5
  },
  containerMeaning: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingLeft: 20,
    paddingTop: 10
  },
  bigText: {
    fontSize: 17
  },
  smallText: {
    fontSize: 12
  },
  list: {
    marginTop: 10
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#dddddd",
  },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    alignItems: "center"
  },
  middleText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  meaningText: {
    color: "#3b5998",
    marginBottom: 10
  },
  exampleLabel: {
    fontWeight: "bold",
    color: "red"
  },
  exampleList: {
    paddingLeft: 10
  },
  khExample: {
    paddingLeft: 20,
    color: "#000000"
  }
});
