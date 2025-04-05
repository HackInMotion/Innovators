import { gql } from "@apollo/client";

const getCategories = gql`
  query {
    getCategories {
      category {
        id
        name
        categoryImage
      }
      countCourses
    }
  }
`;

const GET_COURSES_BY_CATEGORY = gql`
  query ($category: String!) {
    getCoursesByCategory(category: $category) {
      id
      title
      categoryName
      instructorName
      coverImage
      price
      countModules
      countLessons
    }
  }
`;

const GET_COURSES_BY_ID = gql`
  query ($id: Int!) {
    getCourseById(id: $id) {
      course {
        id
        title
        description
        requirements
        outcomes
        whatLearn
        rating
        category {
          name
        }
        coverImage
        price
        modules {
          id
          title
          order
          lessons {
            order
            title
            videoUrl
            duration
          }
        }
        instructor {
          name
          avatar
        }
      }
      totalLessons
      enrolledStudentCount
      totalDuration
    }
  }
`;

const GET_ENROLLED_COURSE = gql`
  query ($id: Int!) {
    getCourseById(id: $id) {
      course {
        id
        title
        modules {
          id
          title
          lessons {
            id
            title
            content
            duration
            videoUrl
          }
        }
      }
    }
  }
`;

const IS_USER_ENROLLED = gql`
  query ($courseId: Int!) {
    isUserEnrolledInCourse(courseId: $courseId) {
      isEnrolled
    }
  }
`;

export {
  getCategories,
  GET_COURSES_BY_CATEGORY,
  GET_COURSES_BY_ID,
  GET_ENROLLED_COURSE,
  IS_USER_ENROLLED
};
