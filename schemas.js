const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.roasterySchema = Joi.object({
    roastery: Joi.object({
        nama: Joi.string().required().escapeHTML(),
        harga: Joi.number().required().min(0),
        geometry: Joi.string(),
        // gambar: Joi.string().required(),
        lokasi: Joi.string().required().escapeHTML(),
        deskripsi: Joi.string().required().escapeHTML()
    }).required(),
    hapusGambar: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});