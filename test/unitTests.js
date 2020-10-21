const sinon = require('sinon')
const chai = require('chai')
const expect = chai.expect

const dataController = require('../controllers/data-controller')
const imagesMock = require('../mocks/images_list.json')
const mockReqRes = require('mock-req-res')
const req = mockReqRes.mockRequest();
const res = mockReqRes.mockResponse();

describe('Images List', function ()  {
    afterEach(function () {
        dataController.getAllImagesWithoutTags.restore();
    })
    it('should return all images', async function () {
        sinon.stub(dataController, 'getAllImagesWithoutTags').returns(imagesMock);
        const response = await dataController.getAllImages(req, res)
        expect(response).to.deep.equal(imagesMock)
    })

    it('should return all images when tags exist', async function () {
        sinon.stub(dataController, 'getAllImagesWithoutTags').returns(imagesMock);
        req.query.tags = '#dog';
        const response = await dataController.getAllImages(req, res)
        expect(response).to.deep.equal(imagesMock)
    });
})
