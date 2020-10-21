const sinon = require('sinon')
const chai = require('chai')
const expect = chai.expect

const auth = require('../controllers/auth')
const dataController = require('../controllers/data-controller')
const imagesMock = require('../mocks/images_list.json')
const mockReqRes = require('mock-req-res')
const req = mockReqRes.mockRequest();
const res = mockReqRes.mockResponse();

describe('Images List', function ()  {
    afterEach(function () {
    })
    it('should return all images', async function () {
        sinon.stub(dataController, 'getAllImagesWithoutTags').returns(imagesMock);
        const response = await dataController.getAllImages(req, res)
        expect(response).to.deep.equal(imagesMock)
        dataController.getAllImagesWithoutTags.restore();

    })

    it ('should upload image if image exists', () => {
        const uploadMock = (req, res) => {
            if (!req.file) {
                return "No File"
            } else {
                return 'Upload success'
            }
        }
        req.file = true
        sinon.stub(dataController, 'uploadImage').callsFake(uploadMock)
        expect(dataController.uploadImage(req, res)).contains('Upload')
        req.file = null
        expect(dataController.uploadImage(req,res)).contains('No File')
        dataController.uploadImage.restore()
    })

    it('should return all users List', () => {
        const mockUserList = [{"id":1,"name":"test1",
            "password":"$2b$10$RA1ccz9G37i390Ylq976r.zi07nyLE2q7NQ33YTu7yJqRU9BgzNiO",
            "createdAt":"2020-10-21T19:14:08.926Z",
            "updatedAt":"2020-10-21T19:14:08.926Z"
        }]
        sinon.stub(auth, 'getUsers').returns(mockUserList)
        expect(auth.getUsers(req, res)).to.deep.equal(mockUserList)
        auth.getUsers.restore()
    })
})
