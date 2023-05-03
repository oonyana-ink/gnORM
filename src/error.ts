import { ZodError, ZodInvalidTypeIssue, ZodIssue, ZodTooBigIssue, ZodTooSmallIssue, } from "zod";
import { capitalize, splitCamelCase } from "./utils";

interface FormattedIssue {
    code: string
    fieldName: string
    message: string
    maximum?: number
    minimum?: number
    validation?: string
}

const ERROR_MESSAGES = {
    required: (issue: FormattedIssue) => `${issue.fieldName} is required.`,
    invalid_type: (issue: FormattedIssue) => `${issue.fieldName} seems to be invalid.`,
    too_long: (issue: FormattedIssue) => `${issue.fieldName} needs to be less than ${issue.maximum} characters.`,
    too_short: (issue: FormattedIssue) => `${issue.fieldName} needs to be more than ${issue.minimum} characters.`,
    exact: (issue: FormattedIssue) => `${issue.fieldName} needs to be exactly ${issue.maximum || issue.minimum} characters.`,
    too_big: (issue: FormattedIssue) => `${issue.fieldName} needs to be less than ${issue.maximum}.`,
    too_small: (issue: FormattedIssue) => `${issue.fieldName} needs to be more than ${issue.minimum}.`,
    invalid_string: (issue: FormattedIssue) => `${issue.fieldName} needs to be a valid ${issue.validation}.`,
} as { [key: string]: (issue: FormattedIssue) => string }

const formatIssue = (issue: ErrorIssue) => {
    const formattedIssue = {
        fieldName: splitCamelCase(issue.path.join('')).map(capitalize).join(' '),
        code: resolveIssueCode(issue as ErrorIssue),
        message: issue.message
    } as FormattedIssue
    const messageFormatter = ERROR_MESSAGES[formattedIssue.code]
    formattedIssue.message = messageFormatter
        ? messageFormatter({ ...issue, ...formattedIssue } as FormattedIssue)
        : formattedIssue.message
    return formattedIssue
}

const resolveIssueCode = (issue: ErrorIssue) => {
    let issueCode: string = issue.code
    switch (issueCode) {
        case 'invalid_type':
            issueCode = issue.received === 'undefined' ? 'required' : 'invalid_type'
            break;
        case 'too_big':
            issueCode =
                (issue.exact && 'exact') ||
                (issue.type === 'string' && 'too_long') ||
                'too_big'
            break;
        case 'too_small':
            issueCode =
                (issue.exact && 'exact') ||
                (issue.type === 'string' && 'too_short') ||
                'too_small'
            break;
        case 'invalid_string':
            issueCode =
                (issue.validation && `invalid_${issue.validation}`) ||
                'invalid_string'
    }
    return issueCode
}

export const ValidationError = (error: ZodError): FieldErrors => {
    const _issues = error.issues as unknown as ErrorIssue[]
    const _FieldErrors = {} as FieldErrors
    _issues.forEach(issue => {
        const formattedIssue = formatIssue(issue)
        const issueCode = resolveIssueCode(issue)
        _FieldErrors[issue.path.join('.')] = {
            code: issueCode,
            message: formattedIssue.message
        }
    })
    return _FieldErrors
}


// export class Error {
//     issues: any[]
//     constructor(error: ZodError) {
//         const { issues } = error
//         this.issues = issues
//     }

//     get byField() {
//         const byFieldMap = {} as { [key: string]: any }
//         this.issues.forEach(issue => {
//             const formattedIssue = this.formatIssue(issue)
//             byFieldMap[issue.path.join('.')] = {
//                 code: formattedIssue.code,
//                 message: formattedIssue.message
//             }
//         })
//         return byFieldMap
//     }

//     formatIssue(issue: ZodIssue) {
//         const formattedIssue = {
//             fieldName: splitCamelCase(issue.path.join('')).map(capitalize).join(' '),
//             code: this.resolveIssueCode(issue),
//             message: issue.message
//         } as FormattedIssue
//         const messageFormatter = ERROR_MESSAGES[formattedIssue.code]
//         formattedIssue.message = messageFormatter
//             ? messageFormatter({ ...issue, ...formattedIssue } as FormattedIssue)
//             : formattedIssue.message
//         return formattedIssue
//     }

//     resolveIssueCode(issue: objectInstance) {
//         let issueCode: string = issue.code
//         switch (issueCode) {
//             case 'invalid_type':
//                 issueCode = issue.received === 'undefined' ? 'required' : 'invalid_type'
//                 break;
//             case 'too_big':
//                 issueCode =
//                     (issue.exact && 'exact') ||
//                     (issue.type === 'string' && 'too_long') ||
//                     'too_big'
//                 break;
//             case 'too_small':
//                 issueCode =
//                     (issue.exact && 'exact') ||
//                     (issue.type === 'string' && 'too_short') ||
//                     'too_small'
//                 break;
//         }
//         return issueCode
//     }
// }