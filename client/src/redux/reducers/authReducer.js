const initialState = {

}

export default (state = initialState, action) => {
  const {type, payload}=action;
  switch (type) {
    case "":
    return { ...state };

  default:
    return state
  }
};
