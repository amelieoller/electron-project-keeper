import React, { Component, createContext } from "react";
import { firestore } from "../firebase";
import { collectIdsAndData } from "../utils/utilities";

export const TagsContext = createContext();

class TagsProvider extends Component {
  state = { tags: [] };

  unsubscribe = null;

  componentDidMount = () => {
    this.unsubscribe = firestore.collection("tags").orderBy("name", "asc").onSnapshot(snapshot => {
      const tags = snapshot.docs.map(collectIdsAndData);
      this.setState({ tags });
    });
  };

  componentWillUnmount = () => {
    this.unsubscribe();
  };

  render() {
    const { tags } = this.state;
    const { children } = this.props;

    return (
      <TagsContext.Provider value={{ tags }}>{children}</TagsContext.Provider>
    );
  }
}

export default TagsProvider;
