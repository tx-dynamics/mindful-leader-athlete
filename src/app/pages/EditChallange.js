import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useParams, useHistory, withRouter } from "react-router-dom";
import ChallangeService from "../services/ChallangeService";
import moment from "moment";
import queryString from "query-string";

function EditChallange(props) {
  let history = useHistory();
  const params = useParams();

  console.log("Props: ", params.id, props);
  const query = queryString.parse(props.location.search);
  console.log("query: ", query);
  //   const data = props.location.state.data;

  //   const SD = moment(data.startDate).format("YYYY-MM-DD");
  //   const ED = moment(data.expiryDate).format("YYYY-MM-DD");

  const [challangeTitle, setChallangeTitle] = useState("");
  const [companyName, setCompanyName] = useState(query.company);
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const [formValues, setFormValues] = useState([
    { habbitTitle: "", habbitDescription: "" },
  ]);

  useEffect(() => {
    ChallangeService.getSingleChallange(params.id).then((res) => {
      console.log("RES:", res);
      setChallangeTitle(res.challangeTitle);
      const SD = moment(res.startDate).format("YYYY-MM-DD");
      const ED = moment(res.expiryDate).format("YYYY-MM-DD");
      setStartDate(SD);
      setExpiryDate(ED);
      setFormValues(res.habbits);
    });
  }, []);

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  let addFormFields = () => {
    setFormValues([...formValues, { habbitTitle: "", habbitDescription: "" }]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await ChallangeService.updateChallange(params.id, {
        challangeTitle,
        companyName,
        startDate,
        expiryDate,
        habbits: formValues,
      });
      console.log("REs", res);
      props.history.push("/challanges");
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <>
      <Card className="card card-custom gutter-b example example-compact">
        <Card.Header>
          <Card.Title>
            <h3 className="card-label">Edit Challange</h3>
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Form>
            <div className="row">
              <div className="col-md-5">
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Challange Title</Form.Label>
                  <Form.Control
                    value={challangeTitle}
                    onChange={(e) => setChallangeTitle(e.target.value)}
                    type="text"
                    placeholder="Enter Challange Title"
                  />
                  {/* <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text> */}
                </Form.Group>
              </div>
              <div className="col-md-5">
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    value={companyName}
                    placeholder="Company for which challange creating..."
                    onChange={(e) => setCompanyName(e.target.value)}
                    type="text"
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-5">
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    name="date"
                    placeholder="date placeholder"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    type="date"
                  />
                </Form.Group>
              </div>
              <div className="col-md-5">
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control
                    name="date"
                    placeholder="date placeholder"
                    value={expiryDate}
                    onChange={(e) => {
                      setExpiryDate(e.target.value);
                    }}
                    type="date"
                  />
                </Form.Group>
              </div>
            </div>

            {/* <div className="col-md-12"> */}
            {formValues.map((element, index) => (
              <div key={index}>
                <hr className="my-3" />
                <div className="row">
                  <div className="col-md-5">
                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>Habbit Title({index + 1})</Form.Label>
                      <Form.Control
                        name="habbitTitle"
                        placeholder="Habbit Title"
                        value={element.habbitTitle || ""}
                        onChange={(e) => handleChange(index, e)}
                        type="text"
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-5">
                    <Form.Group controlId="formBasicPassword">
                      <Form.Label> Habbit Description({index + 1})</Form.Label>
                      <Form.Control
                        placeholder="Write a description text here ..."
                        rows="1"
                        type="textarea"
                        name="habbitDescription"
                        value={element.habbitDescription || ""}
                        onChange={(e) => handleChange(index, e)}
                      />
                    </Form.Group>
                  </div>

                  <div className="col-md-2">
                    {index ? (
                      <Button
                        variant="danger"
                        onClick={() => removeFormFields(index)}
                        style={{ marginTop: "1.8rem" }}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
            <div className="col-md-10">
              <Button
                variant="success"
                size="lg"
                block
                onClick={() => addFormFields()}
                style={{ marginBottom: "2rem" }}
              >
                Add Habbit
              </Button>
            </div>
            {/* </div> */}

            <div className="col-md-10">
              <Button
                variant="primary"
                size="lg"
                block
                type="submit"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}

export default withRouter(EditChallange);
