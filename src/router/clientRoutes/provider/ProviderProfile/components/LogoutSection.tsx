import RouteNames from "@/constants/routeNames";
import { removeToken, removeUser } from "@/reducers/tokenSlice";
import * as Tabs from "@radix-ui/react-tabs";
const LogoutSection = (props: any) => {
  const { dispatch, navigate } = props;

  return (
    <Tabs.Content value="logout" className="pt-4">
      <h2 className="text-xl font-bold mb-4 text-red-600">Log Out</h2>
      <p className="text-gray-700">
        Are you sure you want to log out? You will need to log in again to
        access your account.
      </p>
      <button
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500"
        onClick={() => {
          dispatch(removeToken());
          dispatch(removeUser());
          navigate(RouteNames.HOME);
        }}
      >
        Log Out
      </button>
    </Tabs.Content>
  );
};

export default LogoutSection;
