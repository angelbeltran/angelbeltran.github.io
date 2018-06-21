import React, { Component } from 'react';
import 'react-aspect-ratio/aspect-ratio.css';
import AspectRatio from 'react-aspect-ratio';
import portrait from './uoregon.jpg';

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.smallScreenWidthCheck = this.smallScreenWidthCheck.bind(this);
    this.mediumScreenWidthCheck = this.mediumScreenWidthCheck.bind(this);
    this.largeScreenWidthCheck = this.largeScreenWidthCheck.bind(this);
    this.xtraLargeScreenWidthCheck = this.xtraLargeScreenWidthCheck.bind(this);

    this.mediaQueries = {
      sm: window.matchMedia('(min-width: 576px)'),
      md: window.matchMedia('(min-width: 768px)'),
      lg: window.matchMedia('(min-width: 992px)'),
      xl: window.matchMedia('(min-width: 1200px)'),
    };
    this.mediaQueries.sm.addListener(this.smallScreenWidthCheck);
    this.mediaQueries.md.addListener(this.mediumScreenWidthCheck);
    this.mediaQueries.lg.addListener(this.largeScreenWidthCheck);
    this.mediaQueries.xl.addListener(this.xtraLargeScreenWidthCheck);

    this.state = {
      size: { // based of bootstrap breakpoints
        sm: this.mediaQueries.sm.matches,
        md: this.mediaQueries.md.matches,
        lg: this.mediaQueries.lg.matches,
        xl: this.mediaQueries.xl.matches,
      }
    };
  }

  componentWillUnmount() {
    this.mediaQueries.sm.removeListener(this.smallScreenWidthCheck);
    this.mediaQueries.md.removeListener(this.mediumScreenWidthCheck);
    this.mediaQueries.lg.removeListener(this.largeScreenWidthCheck);
    this.mediaQueries.xl.removeListener(this.xtraLargeScreenWidthCheck);
  }

  smallScreenWidthCheck(e) {
    this.updateSizeState('sm', e.matches);
  }

  mediumScreenWidthCheck(e) {
    this.updateSizeState('md', e.matches);
  }

  largeScreenWidthCheck(e) {
    this.updateSizeState('lg', e.matches);
  }

  xtraLargeScreenWidthCheck(e) {
    this.updateSizeState('xl', e.matches);
  }

  updateSizeState(size, value) {
    this.setState({
      size: {
        ...this.state.size,
        [size]: Boolean(value),
      },
    });
  }

  render() {
    console.log(JSON.stringify(this.state, null, 2));
    return (
      <div className="container pt-4">
        <div className="row d-flex">
          <div className="col-sm-7 col-md-9 d-flex align-items-center">

            <p>
              Domestic confined any but son bachelor advanced remember. How proceed offered her offence shy forming. Returned peculiar pleasant but appetite differed she. Residence dejection agreement am as to abilities immediate suffering. Ye am depending propriety sweetness distrusts belonging collected. Smiling mention he in thought equally musical. Wisdom new and valley answer. Contented it so is discourse recommend. Man its upon him call mile. An pasture he himself believe ferrars besides cottage. 
            </p>

          </div>

            <div className="col-sm-5 col-md-3 d-flex justify-content-center">
              <AspectRatio ratio="200/300" style={{ maxWidth: '200px', minWidth: '100px', maxHeight: '300px', flexGrow: 1 }}>
                <img src={portrait} alt="portrait" />
              </AspectRatio>
            </div>
        </div>

        <div className="row">
        </div>
      </div>
    );
  }
}


export default HomePage;


/*
              Domestic confined any but son bachelor advanced remember. How proceed offered her offence shy forming. Returned peculiar pleasant but appetite differed she. Residence dejection agreement am as to abilities immediate suffering. Ye am depending propriety sweetness distrusts belonging collected. Smiling mention he in thought equally musical. Wisdom new and valley answer. Contented it so is discourse recommend. Man its upon him call mile. An pasture he himself believe ferrars besides cottage. 

              Still court no small think death so an wrote. Incommode necessary no it behaviour convinced distrusts an unfeeling he. Could death since do we hoped is in. Exquisite no my attention extensive. The determine conveying moonlight age. Avoid for see marry sorry child. Sitting so totally forbade hundred to. 

              Behind sooner dining so window excuse he summer. Breakfast met certainty and fulfilled propriety led. Waited get either are wooded little her. Contrasted unreserved as mr particular collecting it everything as indulgence. Seems ask meant merry could put. Age old begin had boy noisy table front whole given. 

              Sociable on as carriage my position weddings raillery consider. Peculiar trifling absolute and wandered vicinity property yet. The and collecting motionless difficulty son. His hearing staying ten colonel met. Sex drew six easy four dear cold deny. Moderate children at of outweigh it. Unsatiable it considered invitation he travelling insensible. Consulted admitting oh mr up as described acuteness propriety moonlight. 

              He moonlight difficult engrossed an it sportsmen. Interested has all devonshire difficulty gay assistance joy. Unaffected at ye of compliment alteration to. Place voice no arise along to. Parlors waiting so against me no. Wishing calling are warrant settled was luckily. Express besides it present if at an opinion visitor. 

              At distant inhabit amongst by. Appetite welcomed interest the goodness boy not. Estimable education for disposing pronounce her. John size good gay plan sent old roof own. Inquietude saw understood his friendship frequently yet. Nature his marked ham wished. 

              Two before narrow not relied how except moment myself. Dejection assurance mrs led certainly. So gate at no only none open. Betrayed at properly it of graceful on. Dinner abroad am depart ye turned hearts as me wished. Therefore allowance too perfectly gentleman supposing man his now. Families goodness all eat out bed steepest servants. Explained the incommode sir improving northward immediate eat. Man denoting received you sex possible you. Shew park own loud son door less yet. 

              Gay one the what walk then she. Demesne mention promise you justice arrived way. Or increasing to in especially inquietude companions acceptance admiration. Outweigh it families distance wandered ye an. Mr unsatiable at literature connection favourable. We neglected mr perfectly continual dependent. 

              In to am attended desirous raptures declared diverted confined at. Collected instantly remaining up certainly to necessary as. Over walk dull into son boy door went new. At or happiness commanded daughters as. Is handsome an declared at received in extended vicinity subjects. Into miss on he over been late pain an. Only week bore boy what fat case left use. Match round scale now sex style far times. Your me past an much. 

              Add you viewing ten equally believe put. Separate families my on drawings do oh offended strictly elegance. Perceive jointure be mistress by jennings properly. An admiration at he discovered difficulty continuing. We in building removing possible suitable friendly on. Nay middleton him admitting consulted and behaviour son household. Recurred advanced he oh together entrance speedily suitable. Ready tried gay state fat could boy its among shall. 
 */
