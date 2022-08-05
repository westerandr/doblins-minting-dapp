// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let totalSupply = await store
        .getState()
        .blockchain.smartContract.methods.totalSupply()
        .call();
      
      let maxMint = await store
        .getState()
        .blockchain.smartContract.methods.maxMint()
        .call();

      let paused = await store
        .getState()
        .blockchain.smartContract.methods.paused()
        .call();

      let userWallet = await store.getState().blockchain.account;
      let userNumMinted = 0
      if(userWallet && userWallet != null) {
        userNumMinted = await store
        .getState()
        .blockchain.smartContract.methods.numMinted(userWallet)
        .call();
      }

      // let cost = await store
      //   .getState()
      //   .blockchain.smartContract.methods.cost()
      //   .call();

      dispatch(
        fetchDataSuccess({
          totalSupply,
          maxMint,
          paused,
          userNumMinted,
          // cost,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
