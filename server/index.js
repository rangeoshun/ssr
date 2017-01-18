import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { express, helmet } from './utils/peerDependencies';
import logger from './utils/logger';
import { perfStart, perfStop } from './utils/perfMeasure';
// Serving steps
import userAgentAnalysis from './steps/userAgentAnalysis';
import cacheAnalysis from './steps/cacheAnalysis';
import createDataContext from './steps/createDataContext';
import applicationRendering from './steps/applicationRendering';
import transport from './steps/transport';
import cacheFilling from './steps/cacheFilling';

/* eslint-disable import/no-mutable-exports */
// For debug purposes
let debugLastRequest = null;
let debugLastResponse = null;
/* eslint-enable */

// URL pattern covered by Express
// @NOTE URLs that contains no dot and that doesn't start with "/api"
const EXPRESS_COVERED_URL = /^[^.]*^(?!\/api)/;

/* eslint-disable no-param-reassign */
const createRouter = (MainApp, store, ServerRouter, createServerRenderContext) => {
  // Create an Express server
  const app = express();
  // Secure Express
  app.use(helmet());
  app
  .route(EXPRESS_COVERED_URL)
  .get((req, res, next) => {
    const url = req.path;
    // Start performance cheking
    perfStart();
    debugLastRequest = req;
    debugLastResponse = res;
    // Inpure structure for storing results throughout steps
    const stepResults = {
      req,
      res,
      next,
      url,
      browserType: null,
      statusCode: 200,
      hash: null,
      head: null,
      body: null,
      Location: null,
      isFromCache: false,
      is404fromCache: false,
      store,
      dataContext: null,
      dataMarkup: null,
      MainApp,
      // Used for circumventing issues on checkNpmDependencies
      ServerRouter,
      createServerRenderContext,
    };

    // STEP1 User agent analysis
    userAgentAnalysis(stepResults);
    // SETP2 Cache analysis
    // @TODO Find a pattern for expressing query based on: const query = req.query;
    cacheAnalysis(stepResults);
    // STEP3 Create data context
    createDataContext(stepResults);
    // STEP4 Application rendering if required
    applicationRendering(stepResults);
    // STEP5 Transport
    transport(stepResults);
    // STEP6 Cache filling if required
    cacheFilling(stepResults);

    // End performance cheking
    perfStop(`${stepResults.statusCode} - ${stepResults.url}`);
  });
  // Add Express to Meteor's connect
  WebApp.connectHandlers.use(Meteor.bindEnvironment(app));
};

// Server side exports
export default createRouter;
export {
  logger,
  // For easing debug in `meteor shell`
  debugLastRequest, debugLastResponse,
};