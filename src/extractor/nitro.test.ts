import { _convertToUrlPath } from './nitro'

describe('netro extractor', () => {
  it('convert to url path', () => {
    const tests = [
      {
        path: 'api/index.ts',
        expected: {
          path: '/api',
          method: 'get',
          params: [],
        },
      },
      {
        path: 'api/hello.ts',
        expected: {
          path: '/api/hello',
          method: 'get',
          params: [],
        },
      },
      {
        path: 'api/hello.get.ts',
        expected: {
          path: '/api/hello',
          method: 'get',
          params: [],
        },
      },
      {
        path: 'api/hello.post.ts',
        expected: {
          path: '/api/hello',
          method: 'post',
          params: [],
        },
      },
      {
        path: 'api/user/[id].get.ts',
        expected: {
          path: '/api/user/{id}',
          method: 'get',
          params: [
            {
              name: 'id',
            },
          ],
        },
      },
      {
        path: 'api/user/[id].post.ts',
        expected: {
          path: '/api/user/{id}',
          method: 'post',
          params: [
            {
              name: 'id',
            },
          ],
        },
      },
      {
        path: 'api/user/[id]/[name].put.ts',
        expected: {
          path: '/api/user/{id}/{name}',
          method: 'put',
          params: [
            {
              name: 'id',
            },
            {
              name: 'name',
            },
          ],
        },
      },
    ]

    for (const t of tests) {
      const resp = _convertToUrlPath(t.path)
      expect(resp).eqls(t.expected)
    }
  })
})
