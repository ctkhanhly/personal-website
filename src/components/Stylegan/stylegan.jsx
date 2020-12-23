import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MathJax from 'react-mathjax2';
import React from "react";
import  stylegan_architecture from '../../assets/imgs/stylegan.png';
import  manifold_stylegan from '../../assets/imgs/manifold_stylegan.jpeg';
import skip_net from '../../assets/imgs/skip_stylegan2.png';
import res_net from '../../assets/imgs/resnet_stylegan2.png';
import demodulation from '../../assets/imgs/demodulation.png';
import no_pre_train from '../../assets/imgs/no_pre_train.jpg';
import raw from '../../assets/imgs/grid_summary_raw.png';
import real from '../../assets/imgs/grid_summary_real.png';
import fake from '../../assets/imgs/grid_summary.png';





const eq1  = () => {
    return (
        <div>
            <MathJax.Context input='ascii' >   
            <div>
                <MathJax.Node inline>{'w = w + \psi (w - w)'}</MathJax.Node>
            </div>
                
            </MathJax.Context>
        </div>
    )
};
const eq2 =    `(x_i, y) =  y_{s,i} \frac{x_i -  \mu  (x_i)}{\sigma (x_i)}+  y_{b,i}`

export default function StyleGan2() {
    
  return (
    <div  className="card">
   
  
    <h1>StyleGan</h1>
      
    <figure>
    <img src={stylegan_architecture}  style={{height:'300px'}}></img>
    
    <figcaption>Figure 1 - StyleGan architecture from the paper</figcaption>
    </figure>
      
      <h2>Mapping Network f</h2>
        <p>
        In the stylegan architecture, the generator is split into two components, a mapping network f
        and a synthesis network. The author argues that the first network is a nonlinear function that
        transforms a latent code z $\in$ Z to a latent space w $\in$ W to enhance the disentanglement of z. Given a dataset and 
        an input latent z that matches the distribution of this dataset, features are highly entangled. For example,
        it is hard to decompose the features into distinct characteristics such that each feature vector corresponds
        to an attribute, say hair, eyes, ears. f is designed to be an neural network with 8 fully connected layers 
        where each is a linear fully connected layer with an added bias term followed by a LeakyRelu activation.
        It has been shown that a neural network of this form (with variable number of layers, consult <a href="http://neuralnetworksanddeeplearning.com/chap4.html">this</a> article for 
        a good explaination) can approximate any function. The specific 8 layers come from their experiments in which they obtain a good results using 8 layers. 
        </p>
        <figure>
        <img src={manifold_stylegan}></img>
        
        <figcaption>Figure 2 - StyleGan Input, Latent Code, Latent Space Manifolds</figcaption>
        </figure>
        <p>
        Consider Figure 2 from the paper, since after the normalization step, z becomes constraint within a sphere
        but since z has to preserve the statistics of the input space, it is a morphed representation of the original distribution.
        The goal is to make features as disentangled as possible so f helps achieve transforming a nonlinear representation  
        of the input space in z to a more linear representation, where w lies in the real input manifold that contains all the features. 
        The author shows that w is a better representation of the input than z by comparing a perceptual-based pairwise image distance between Z and W. 
        The author also shows that w is more linear than z by 40 binary SVM classifiers corresponding to 40 attributes in CelebA dataset(e.g: male versus female faces).
        Scores by these classifiers are lower in W than Z, thus, W seems to be more linearly separable than Z. 
        </p>
        <h2>AdaIn</h2>
        <p>
        The AdaIn operation is defined as 
        AdaIn {eq2}
        where x_i is a feature map. {  `y_{s,i}`} is the scale learned as the output of a fully connected layer where input is from a latent vector w of the layer x_i is in,
        and output is a vector of elements {  `y_{s,i}, y_{b,i}`} corresponding to each feature map of that layer 
        </p>

        <h2>Style Mixing</h2>
        <p>
        To reduce dependence on one style, stylegan allows us to casually use a second latent z2 $->$ w2 that stylizes some layers in the synthesis network,
        and the original latent z $->$ w to stylizes other layers. This is a form of regularization that decorrelates neighboring styles in the synthesis network.
        </p>
        <h2>Truncation Trick</h2>
        <p>
        StyleGan to allow a "padding" for low-density features to aid the generator to learn them by scaling w from the center on some early layers.
        {/* <eq1/> */}
       
        w = w + \psi (w - w)
        
        </p>
        <h2>Clarifications On The input</h2>
        <p>
        In contrast to feeding an input image to the synthesis netowrk, the first 4x4 layer in the synthesis network g, however, is a learned input that could be initialized to some constant, 
        such as random normal values. The latent code z, however, could be any random values that are fed to the mapping during training. 
        To add stochatiscity to a given latent code, stylegan also introduces a noise input B (in Figure 1) that allows small variations like how individual hairs are placed differently
        in the generated image. For inference, a given output image can be projected back to find a corresponding input latent w and noise vectors for each layer in the synthesis network. 
        Input image and a starting generated image are fed into a VGG16 network and the Lpips distance between the resulting embeddings are used to optimize the latent input w and noise vectors
        for some number of steps (1000 in the original paper, 500 in my experiments described below). 
        This is the main computational cost in inferring due to the optimization cost in each step.
        </p>

    {/* StyleGan2 */}
    <h1>StyleGan2</h1>
    <p>
    StyleGan2 replaces the AdaIn operation in StyleGan and add skip connections in the generator and residual network in the discriminator. 
    The overall architecture is described in the figure below.
    </p>
    <figure>
        <img src={skip_net} style={{height: '300px'}}></img>
        
        <figcaption>Figure 3 - Skip Net Encoder Generator Artchitecture </figcaption>
    </figure>

    <figure>
        <img src={res_net} style={{height: '300px'}} ></img>
        
        <figcaption>Figure 4 - ResNet Decoder Discriminator Artchitecture </figcaption>
    </figure>

    <figure>
        <img src={demodulation} style={{width: '500px'}}></img>
        
        <figcaption>Figure 5 - Revised Modulation in StyleGan2 </figcaption>
    </figure>
    <p>
   In figures 3 and 4, the green colored (middle column in Figure 3 and left column in Figure 4) are constructed using a convolutional network with kernel size 1x1 while 
   the other transformations use the modulation module in Figure 5d. As shown in Figure 5, StyleGan2 removes the normalization layer with a modulation-demodulation operation where each 
   weight in the kernel for each convolution is scaled by by a learned vector of s_i for each feature map in the current layer. A formal
   equation for the operation is: {`\frac{ w'_{ijk} }{ \sqrt{\sum_{i,k} w'_{ijk}^2 + \epsilon } }`}, where {`w'_{ijk} = s_i \dot w_{ijk}`}, {`\sigma_j = \sqrt{\sum_{i,k} w'_{ijk}^2}`}
   </p>
   <h1>Blending </h1>
   <p>
       I started out using Cycle Gan to convert a real face picture to a bitmoji, but the result did not seem to perform well.
       Then I followed <a href="https://www.justinpinkney.com/making-toonify/">Justin's approach</a> to use StyleGan2 for my problem and got pretty good results.
       I only need to train for 10 hours on a single GPU by using transfer learning from a pre-trained ffhq model on a Bitmoji dataset. I think this probably 
       is the main reason why my StyleGan2 outperforms CycleGan experiments. The idea is simple, first project the real image to find the latent w that corresponds to this image,
       again this is a very expensive operation since we need to perform many optimization steps from a VGG16 network embedding of the image. Construct a new synthesis network by choosing a  
       resolution layer, e.g: 32, and combine the original ffhq network part prior to and including this layer with Bitmoji network part after this layer. Below are some experimental results.

       <figure>
        <img src={no_pre_train} style={{width: '500px'}}></img>
        
        <figcaption>Figure 6 - StyleGan2 with no pre-trained network </figcaption>
    </figure>
    <figure>
        <img src={raw} style={{width: '500px'}}></img>
        
        <figcaption>Figure 7 - Raw Input </figcaption>
    </figure>
    <figure>
        <img src={real} style={{width: '500px'}}></img>
        
        <figcaption>Figure 8 - Image generated by projected latent space </figcaption>
    </figure>
    <figure>
        <img src={fake} style={{width: '500px'}}></img>
        
        <figcaption>Figure 9 - Image generated by blended model at resolution 128 </figcaption>
    </figure>
   </p>
    </div>
  );
}