import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { BuilderPage } from "./pages/BuilderPage";
import { MyPage } from "./pages/MyPage";
import { DashboardPage } from "./pages/DashboardPage";
import Companies from "./pages/Companies";
import { Challanges } from "./pages/Challanges";
import Users from "./pages/Users";
import CreateChallange from "./pages/CreateChallange";
import EditCompany from "./pages/EditCompany";
import CreateCompany from "./pages/CreateCompany";
import EditChallange from "./pages/EditChallange";
import CompanyUsers from "./pages/CompanyUsers";

const GoogleMaterialPage = lazy(() =>
  import("./modules/GoogleMaterialExamples/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./modules/ReactBootstrapExamples/ReactBootstrapPage")
);
const ECommercePage = lazy(() =>
  import("./modules/ECommerce/pages/eCommercePage")
);

export default function BasePage() {
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  return (
    // <Suspense fallback={<LayoutSplashScreen/>}>
    <Switch>
      {
        /* Redirect from root URL to /dashboard. */
        <Redirect exact from="/" to="/dashboard" />
      }
      <ContentRoute path="/dashboard" component={DashboardPage} />
      <ContentRoute path="/companies" component={Companies} />
      <ContentRoute path="/company/users/:id" component={CompanyUsers} />
      <ContentRoute path="/createCompany" component={CreateCompany} />
      <ContentRoute path="/editCompany/:id" component={EditCompany} />
      <ContentRoute path="/challanges" component={Challanges} />
      <ContentRoute path="/createChallange" component={CreateChallange} />
      <ContentRoute path="/editChallange/:id" component={EditChallange} />
      <ContentRoute path="/users" component={Users} />
      <Route path="/react-bootstrap" component={ReactBootstrapPage} />
      {/* <ContentRoute path="/builder" component={BuilderPage} />
      <ContentRoute path="/my-page" component={MyPage} />
      <Route path="/google-material" component={GoogleMaterialPage} />
      <Route path="/react-bootstrap" component={ReactBootstrapPage} />*/}
      <Route path="/e-commerce" component={ECommercePage} />
      <Redirect to="error/error-v1" />
    </Switch>
    // </Suspense>
  );
}
